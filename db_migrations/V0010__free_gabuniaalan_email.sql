UPDATE users 
SET email = CONCAT(email, '_old_', id) 
WHERE email = 'gabuniaalan13@gmail.com';