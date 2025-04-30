import React from 'react';
import { useRouter } from 'next/router';

interface StepProps {
  label: string;
  stepNumber: number;
  isCurrent: boolean;
  isCompleted: boolean;
}

const Step: React.FC<StepProps> = ({ label, stepNumber, isCurrent, isCompleted }) => {
  const baseClasses = "flex flex-col items-center text-center px-2";
  const circleBase = "w-8 h-8 rounded-full flex items-center justify-center font-semibold mb-1";
  const textBase = "text-xs sm:text-sm";

  let circleClasses = circleBase;
  let textClasses = textBase;

  if (isCurrent) {
    circleClasses += " bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-500";
    textClasses += " text-indigo-600 font-medium";
  } else if (isCompleted) {
    circleClasses += " bg-green-500 text-white";
    textClasses += " text-gray-700";
  } else {
    circleClasses += " bg-gray-300 text-gray-600";
    textClasses += " text-gray-500";
  }

  return (
    <div className={baseClasses}>
      <div className={circleClasses}>{stepNumber}</div>
      <span className={textClasses}>{label}</span>
    </div>
  );
};

interface ProgressIndicatorProps {
  // Add props if needed, e.g., to manually set the current step
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = () => {
  const router = useRouter();
  const currentPath = router.pathname;

  // Determine current step based on route
  let currentStep = 0; // Default to 0 (no step active)
  if (currentPath === '/' || currentPath === '/events') {
    currentStep = 1; // Event selection
  } else if (currentPath === '/accommodation') {
    currentStep = 2; // Accommodation selection
  } else if (currentPath === '/transportation') { // Assuming '/transportation' is the next step
    currentStep = 3; // Transportation selection
  }
  // Add more steps if needed

  const steps = [
    { label: 'Event', stepNumber: 1 },
    { label: 'Accommodation', stepNumber: 2 },
    { label: 'Transportation', stepNumber: 3 },
  ];

  return (
    <div className="w-full bg-gray-100 py-4 mb-6 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-start relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300" style={{ zIndex: 0 }}></div>
          <div 
            className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-300 ease-in-out" 
            style={{ 
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`, 
              zIndex: 1 
            }}
          ></div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.stepNumber} className="relative z-10 flex-1 flex justify-center">
               {/* Adjust justification for first/last steps */}
               {index === 0 && <div className="w-full flex justify-start"><Step {...step} isCurrent={currentStep === step.stepNumber} isCompleted={currentStep > step.stepNumber} /></div>}
               {index === steps.length - 1 && <div className="w-full flex justify-end"><Step {...step} isCurrent={currentStep === step.stepNumber} isCompleted={currentStep > step.stepNumber} /></div>}
               {index > 0 && index < steps.length - 1 && <Step {...step} isCurrent={currentStep === step.stepNumber} isCompleted={currentStep > step.stepNumber} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
