import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Property Info" },
  { number: 2, title: "Amenities & Links" },
  { number: 3, title: "Contact & Submit" },
];

const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <div key={step.number} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 relative z-10",
                  currentStep > step.number
                    ? "bg-accent text-accent-foreground"
                    : currentStep === step.number
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs sm:text-sm font-medium text-center",
                  currentStep >= step.number
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 -mt-6 relative">
                <div className="absolute inset-0 bg-muted rounded-full" />
                <div
                  className={cn(
                    "absolute inset-0 bg-accent rounded-full transition-all duration-500",
                    currentStep > step.number ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;