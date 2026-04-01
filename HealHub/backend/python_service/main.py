import os
# Must be set before importing torch or easyocr
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"

import torch
torch.set_num_threads(1)

import cv2
import easyocr
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
import re

app = FastAPI(title="HealHub AI Medicine Scanner Service")

# Initialize EasyOCR reader
# gpu=False for compatibility. quantize=True uses dynamic quantization to cut RAM usage by ~50%
reader = easyocr.Reader(['en'], gpu=False, quantize=True)

# Medical keywords and units to validate if an image is likely a medicine
MEDICAL_KEYWORDS = {
    'mg', 'ml', 'mcg', 'g', 'iu', 'tablet', 'capsule', 'syrup', 'injection',
    'composition', 'dosage', 'prescription', 'rx', 'usp', 'ip', 'bp',
    'pharma', 'laboratories', 'healthcare', 'manufactured', 'expiry', 'mfg'
}

def preprocess_image(image_bytes):
    """Preprocess image using OpenCV for better OCR accuracy."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        return None

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Increase contrast/Denoise (optional but helpful)
    # gray = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    return gray

def is_medical_content(text_list):
    """Check if the extracted text contains medical keywords."""
    combined_text = " ".join(text_list).lower()
    
    # Check for units (e.g., 500mg, 10 ml)
    unit_pattern = r'\d+\s?(mg|ml|mcg|g|iu)\b'
    if re.search(unit_pattern, combined_text):
        return True
        
    # Check for keywords
    words = set(re.findall(r'\w+', combined_text))
    if words.intersection(MEDICAL_KEYWORDS):
        return True
        
    return False

@app.post("/scan")
async def scan_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image.")

    try:
        contents = await file.read()
        
        # 1. Preprocess the image
        processed_img = preprocess_image(contents)
        if processed_img is None:
            raise HTTPException(status_code=400, detail="Invalid image data.")

        # 2. Extract text using EasyOCR
        # detail=0 returns only the text strings
        results = reader.readtext(processed_img, detail=0)
        
        if not results:
            return {
                "success": False,
                "message": "No text detected in image."
            }

        # 3. Validate if it's a medicine
        if not is_medical_content(results):
            return {
                "success": False,
                "message": "This doesn't look like a medicine image. Please upload a clear photo of the medicine box or label.",
                "detected_text": results[:5] # For debugging
            }

        # 4. Return successful extraction
        return {
            "success": True,
            "data": results,
            "count": len(results)
        }

    except Exception as e:
        print(f"Error during scan: {str(e)}")
        return {
            "success": False,
            "message": f"Server error: {str(e)}"
        }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "HealHub AI Scanner"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
