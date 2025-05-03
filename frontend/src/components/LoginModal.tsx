import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignUpClick: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSignUpClick }) => {
  if (!isOpen) return null;

  return (
    
      <div>
        
          Login
          <button onClick={onClose}>&times;</button>
        
        
          
            
              Email
              <input type="email" placeholder="Enter your email" />
            
            
              Password
              <input type="password" placeholder="Enter your password" />
            
          
          
            Login
          
          
            Forgot Password?
          
          
            Or login with:
            
              Google
              Facebook
            
          
          
            Don't have an account? <button onClick={onSignUpClick}>Sign Up</button>
          
            </div>
      
    
  );
};

export default LoginModal;
