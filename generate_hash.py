import bcrypt

# Password to hash
password = "admin123"

# Generate salt and hash the password
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password.encode('utf-8'), salt)

# Print the hash
print("Bcrypt hash for 'admin123':")
print(hashed.decode('utf-8'))
