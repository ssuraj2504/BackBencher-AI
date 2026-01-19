import requests
import json
import os

API_URL = "http://127.0.0.1:8080"
TEST_PDF_PATH = "test.pdf"

def create_dummy_pdf():
    with open(TEST_PDF_PATH, "wb") as f:
        f.write(b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources <<\n/Font <<\n/F1 4 0 R\n>>\n>>\n/MediaBox [0 0 612 792]\n/Contents 5 0 R\n>>\nendobj\n4 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n5 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n70 700 Td\n/F1 24 Tf\n(Hello World) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000010 00000 n\n0000000060 00000 n\n0000000157 00000 n\n0000000302 00000 n\n0000000389 00000 n\ntrailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n492\n%%EOF")

def test_login():
    print("--- Testing Auth ---")
    try:
        # Register (ignore error if exists)
        requests.post(f"{API_URL}/auth/register", json={"email": "test@example.com", "password": "password123"})
        
        # Login
        response = requests.post(f"{API_URL}/auth/login", json={"email": "test@example.com", "password": "password123"})
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return None
        
        token = response.json()["access_token"]
        print(f"Login successful.")
        return token
    except Exception as e:
        print(f"Error: {e}")
        return None

def test_session(token):
    print("\n--- Testing Session ---")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        # Create Session
        # Corrected: use json body
        response = requests.post(f"{API_URL}/session/start", json={"subject": "Database"}, headers=headers)
        if response.status_code == 200:
             print("Session created successfully.")
        else:
             print(f"Session creation failed: {response.text}")

        # Get active session
        response = requests.get(f"{API_URL}/session/current", headers=headers)
        if response.status_code == 200:
            print(f"Active session subject: {response.json()['subject']}")
        else:
            print(f"Get session failed: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

def test_chat(token):
    print("\n--- Testing Chat ---")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        # Chat uses query param 'message'
        response = requests.post(f"{API_URL}/chat/", params={"message": "What is normalization?"}, headers=headers)
        
        if response.status_code == 200:
            print("Chat response received.")
            print(f"Answer: {response.json()['answer'][:100]}...") # Print first 100 chars
        else:
            print(f"Chat failed: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

def test_pdf_upload(token):
    print("\n--- Testing PDF Upload ---")
    try:
        create_dummy_pdf()
        headers = {"Authorization": f"Bearer {token}"}
        
        with open(TEST_PDF_PATH, "rb") as f:
            files = {"file": (TEST_PDF_PATH, f, "application/pdf")}
            response = requests.post(f"{API_URL}/pdf/upload", files=files, headers=headers)
        
        if response.status_code == 200:
             print(f"Upload successful: {response.json()}")
        else:
             print(f"Upload failed: {response.text}")
             
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    token = test_login()
    if token:
        test_session(token)
        test_chat(token)
        test_pdf_upload(token)
