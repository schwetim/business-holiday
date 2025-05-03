import React from 'react';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null;

  return (
    
    <div>
        
          Sign Up
          <button onClick={onClose}>&times;</button>
        
        
          
            
              Email
              <input type="email" placeholder="Enter your email" />
            
            
              Password
              <input type="password" placeholder="Enter your password" />
            
            
              Confirm Password
              <input type="password" placeholder="Confirm your password" />
            
          
          
            Sign Up
          
          
            Or sign up with:
            
              Google
              Facebook
            
          
          
            Already have an account? <button onClick={onLoginClick}>Login</button>
          
        
            </div>
    
  );
};

export default SignupModal;
