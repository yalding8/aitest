
import json
import os

def check_auth_codes():
    file_path = '授权码.json'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if 'codes' not in data:
            print("Error: Invalid JSON format, 'codes' key missing.")
            return
            
        codes = data['codes']
        used_codes = []
        unused_codes = []
        
        for item in codes:
            if item.get('status') == 'used':
                used_codes.append(item)
            else:
                unused_codes.append(item)
                
        print(f"Total codes: {len(codes)}")
        print(f"Used codes: {len(used_codes)}")
        print(f"Unused codes: {len(unused_codes)}")
        
        print("\n--- Used Codes ---")
        if used_codes:
            for c in used_codes:
                used_at = c.get('usedAt', 'N/A')
                print(f"Code: {c['code']}, Used At: {used_at}")
        else:
            print("None")
            
        print("\n--- Unused Codes (First 20) ---")
        if unused_codes:
            for c in unused_codes[:20]:
                print(f"Code: {c['code']}")
            if len(unused_codes) > 20:
                print(f"... and {len(unused_codes) - 20} more.")
        else:
            print("None")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    check_auth_codes()
