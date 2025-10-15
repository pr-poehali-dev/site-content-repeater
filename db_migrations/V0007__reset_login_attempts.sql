UPDATE login_attempts 
SET attempt_time = NOW() - INTERVAL '1 hour' 
WHERE email = 'gabuniaalan13@gmail.com';