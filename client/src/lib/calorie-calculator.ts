/**
 * Calculate BMR using the Mifflin-St Jeor equation
 * @param gender - "male" or "female"
 * @param weight - Weight in kg
 * @param height - Height in cm
 * @param age - Age in years
 * @returns BMR in calories
 */
export function calculateBMR(gender: string, weight: number, height: number, age: number): number {
  let bmr: number;
  
  if (gender === "male") {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else {
    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
  
  return Math.round(bmr);
}

/**
 * Calculate daily calories based on BMR and activity level
 * @param bmr - Basal Metabolic Rate
 * @param activityMultiplier - Activity factor (1.2-1.9)
 * @returns Daily calorie needs
 */
export function calculateDailyCalories(bmr: number, activityMultiplier: number): number {
  return Math.round(bmr * activityMultiplier);
}

/**
 * Get activity level description
 * @param activityLevel - Activity level string value
 * @returns Human-readable description
 */
export function getActivityDescription(activityLevel: string): string {
  const descriptions: Record<string, string> = {
    "1.2": "Sedentary lifestyle",
    "1.375": "Lightly active",
    "1.55": "Moderately active", 
    "1.725": "Very active",
    "1.9": "Super active"
  };
  
  return descriptions[activityLevel] || "Unknown activity level";
}
