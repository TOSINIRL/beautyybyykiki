import urllib.request
import ssl

url = "https://files.antigravity.ai/113a5a2f-b930-4389-bc8f-162c6f0bffd4/input_file_0.png"
path = "assets/loc-styling-new.jpg"

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(url, context=ctx) as response:
        with open(path, 'wb') as f:
            f.write(response.read())
    print("Successfully saved to assets/loc-styling-new.jpg")
except Exception as e:
    print(f"Error: {e}")
