UPDATE users 
SET email = CONCAT(email, '_old_', id) 
WHERE email = 'test@gmail.com';