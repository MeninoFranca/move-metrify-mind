
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Step1 from '../components/onboarding/Step1';
import Step2 from '../components/onboarding/Step2';
import Step3 from '../components/onboarding/Step3';
import Step4 from '../components/onboarding/Step4';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNextStep1 = (data: any) => {
    updateFormData(data);
    nextStep();
  };

  const handleNextStep2 = (data: any) => {
    updateFormData(data);
    nextStep();
  };

  const handleNextStep3 = (data: any) => {
    updateFormData(data);
    nextStep();
  };

  const handleFinish = (data: any) => {
    const finalData = { ...formData, ...data };
    console.log('Onboarding Finished. Final Data:', finalData);
    // Here you would save the data to your backend or localStorage
    // For now, we'll just navigate to the dashboard
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 onNext={handleNextStep1} />;
      case 2:
        return <Step2 onNext={handleNextStep2} onPrev={prevStep} />;
      case 3:
        return <Step3 onNext={handleNextStep3} onPrev={prevStep} />;
      case 4:
        return <Step4 onFinish={handleFinish} onPrev={prevStep} />;
      default:
        return <Step1 onNext={handleNextStep1} />;
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <div className="progress-bar mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-center mt-2">
            Step {step} of 4
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding; 