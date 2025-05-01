import React from 'react';
import { useRouter } from 'next/router';

interface StepProps {
  label: string;
  stepNumber: number;
  isCurrent: boolean;
  isCompleted: boolean;
  onClick: () => void; // Add onClick prop
  isClickable: boolean; // Add isClickable prop
}

const Step: React.FC<StepProps> = ({ label, stepNumber, isCurrent, isCompleted, onClick, isClickable }) => {
  const baseClasses = `flex flex-col items-center text-center px-2 ${isClickable ? 'cursor-pointer' : ''}`; // Add cursor-pointer conditionally
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
    <div className={baseClasses} onClick={isClickable ? onClick : undefined}> {/* Apply onClick conditionally */}
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
  } else if (currentPath === '/transportation') {
    currentStep = 3; // Transportation selection
  } else if (currentPath === '/results') {
    currentStep = 4; // Results/Summary
  }
  // Add more steps if needed

  const steps = [
    { label: 'Event', stepNumber: 1, path: '/' },
    { label: 'Accommodation', stepNumber: 2, path: '/accommodation' },
    { label: 'Transportation', stepNumber: 3, path: '/transportation' },
    { label: 'Summary', stepNumber: 4, path: '/results' },
  ];

  const handleStepClick = (stepNumber: number, targetPath: string) => {
    // Only allow clicking on completed or current steps
    if (stepNumber > currentStep) {
      return;
    }

    const currentQueryParams = router.query;
    let preservedQueryParams: { [key: string]: any } = {};

    // Determine which query parameters to preserve based on the target step
    if (stepNumber >= 2) { // Accommodation and beyond
      if (currentQueryParams.eventId) preservedQueryParams.eventId = currentQueryParams.eventId;
      if (currentQueryParams.location) preservedQueryParams.location = currentQueryParams.location;
    }
    if (stepNumber >= 3) { // Transportation and beyond
      if (currentQueryParams.checkInDate) preservedQueryParams.checkInDate = currentQueryParams.checkInDate;
      if (currentQueryParams.checkOutDate) preservedQueryParams.checkOutDate = currentQueryParams.checkOutDate;
      if (currentQueryParams.accommodationId) preservedQueryParams.accommodationId = currentQueryParams.accommodationId;
    }
    if (stepNumber >= 4) { // Summary
       if (currentQueryParams.origin) preservedQueryParams.origin = currentQueryParams.origin;
       // Add other transportation-related params if they are added later
    }

    // For Step 1 (Event), we navigate to '/' and clear all parameters as per header click logic
    if (stepNumber === 1) {
        preservedQueryParams = {}; // Clear all params for homepage
    }


    router.push({
      pathname: targetPath,
      query: preservedQueryParams,
    });
  };


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
          {steps.map((step, index) => {
             const isClickable = step.stepNumber <= currentStep; // Clickable if current or completed
             return (
               <div key={step.stepNumber} className="relative z-10 flex-1 flex justify-center">
                  {/* Adjust justification for first/last steps */}
                  {index === 0 && (
                     <div className="w-full flex justify-start">
                        <Step
                           {...step}
                           isCurrent={currentStep === step.stepNumber}
                           isCompleted={currentStep > step.stepNumber}
                           onClick={() => handleStepClick(step.stepNumber, step.path)}
                           isClickable={isClickable}
                        />
                     </div>
                  )}
                  {index === steps.length - 1 && (
                     <div className="w-full flex justify-end">
                        <Step
                           {...step}
                           isCurrent={currentStep === step.stepNumber}
                           isCompleted={currentStep > step.stepNumber}
                           onClick={() => handleStepClick(step.stepNumber, step.path)}
                           isClickable={isClickable}
                        />
                     </div>
                  )}
                  {index > 0 && index < steps.length - 1 && (
                     <Step
                        {...step}
                        isCurrent={currentStep === step.stepNumber}
                        isCompleted={currentStep > step.stepNumber}
                        onClick={() => handleStepClick(step.stepNumber, step.path)}
                        isClickable={isClickable}
                     />
                  )}
               </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
