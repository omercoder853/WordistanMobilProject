import React from "react";
import OnboardingStep from "./OnboardingStep";
import Step3Image from "@/shared/assets/OnboardingStep3.png"


export default function Step3(props) {
    return (
        <OnboardingStep
            {...props}
            image={Step3Image}
            titleKey="onboardingStep3Title"
            descriptionKey="onboardingStep3Description"
        />
    );
}
