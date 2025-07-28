import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculateBMR, calculateDailyCalories, getActivityDescription } from "@/lib/calorie-calculator";
import { Calculator, Check, HeartIcon, Activity, FlaskConical, Lightbulb, RotateCcw, Info } from "lucide-react";

const calorieFormSchema = z.object({
  gender: z.enum(["male", "female"], {
    required_error: "Please select your gender",
  }),
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .min(16, "Age must be at least 16")
    .max(100, "Age must be at most 100"),
  weight: z
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .min(30, "Weight must be at least 30 kg")
    .max(300, "Weight must be at most 300 kg"),
  height: z
    .number({
      required_error: "Height is required",
      invalid_type_error: "Height must be a number",
    })
    .min(120, "Height must be at least 120 cm")
    .max(250, "Height must be at most 250 cm"),
  activityLevel: z.string({
    required_error: "Please select your activity level",
  }),
});

type CalorieFormData = z.infer<typeof calorieFormSchema>;

interface CalculationResult {
  bmr: number;
  dailyCalories: number;
  activityMultiplier: number;
  activityDescription: string;
  formula: string;
}

export default function Home() {
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const form = useForm<CalorieFormData>({
    resolver: zodResolver(calorieFormSchema),
    defaultValues: {
      gender: "male",
    },
  });

  const onSubmit = (data: CalorieFormData) => {
    const bmr = calculateBMR(data.gender, data.weight, data.height, data.age);
    const activityMultiplier = parseFloat(data.activityLevel);
    const dailyCalories = calculateDailyCalories(bmr, activityMultiplier);
    const activityDescription = getActivityDescription(data.activityLevel);
    
    const formula = data.gender === "male" 
      ? "BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5"
      : "BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161";

    setCalculationResult({
      bmr,
      dailyCalories,
      activityMultiplier,
      activityDescription,
      formula,
    });
    
    setShowResults(true);
    
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById("resultsSection")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const resetCalculator = () => {
    form.reset({ gender: "male" });
    setShowResults(false);
    setCalculationResult(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      {/* Header Section */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-full mb-4">
          <Calculator className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Calorie Calculator</h1>
        <p className="text-lg text-gray-600 max-w-lg mx-auto">
          Calculate your recommended daily calorie intake based on your age, weight, and activity level using the scientifically-proven Mifflin-St Jeor equation.
        </p>
      </div>

      {/* Main Calculator Form */}
      <div className="max-w-2xl mx-auto">
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Gender Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Gender</Label>
                <RadioGroup
                  value={form.watch("gender")}
                  onValueChange={(value) => form.setValue("gender", value as "male" | "female")}
                  className="grid grid-cols-2 gap-4"
                >
                  <Label className="relative">
                    <RadioGroupItem value="male" className="peer sr-only" />
                    <div className="flex items-center justify-center h-12 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-primary hover:border-gray-300">
                      <span className="mr-2">♂</span>
                      <span className="font-medium">Male</span>
                    </div>
                  </Label>
                  <Label className="relative">
                    <RadioGroupItem value="female" className="peer sr-only" />
                    <div className="flex items-center justify-center h-12 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-blue-50 peer-data-[state=checked]:text-primary hover:border-gray-300">
                      <span className="mr-2">♀</span>
                      <span className="font-medium">Female</span>
                    </div>
                  </Label>
                </RadioGroup>
                {form.formState.errors.gender && (
                  <div className="mt-1 text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠</span>
                    {form.formState.errors.gender.message}
                  </div>
                )}
              </div>

              {/* Age Input */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder=" "
                  min="16"
                  max="100"
                  className={`peer h-14 pt-6 pb-2 text-lg ${
                    form.formState.errors.age ? "border-red-500" : ""
                  }`}
                  {...form.register("age", { valueAsNumber: true })}
                />
                <Label className="absolute left-4 top-2 text-xs font-medium text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all">
                  Age (years)
                </Label>
                {form.formState.errors.age && (
                  <div className="mt-1 text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠</span>
                    {form.formState.errors.age.message}
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder=" "
                  min="30"
                  max="300"
                  step="0.1"
                  className={`peer h-14 pt-6 pb-2 text-lg ${
                    form.formState.errors.weight ? "border-red-500" : ""
                  }`}
                  {...form.register("weight", { valueAsNumber: true })}
                />
                <Label className="absolute left-4 top-2 text-xs font-medium text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all">
                  Weight (kg)
                </Label>
                {form.formState.errors.weight && (
                  <div className="mt-1 text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠</span>
                    {form.formState.errors.weight.message}
                  </div>
                )}
              </div>

              {/* Height Input */}
              <div className="relative">
                <Input
                  type="number"
                  placeholder=" "
                  min="120"
                  max="250"
                  className={`peer h-14 pt-6 pb-2 text-lg ${
                    form.formState.errors.height ? "border-red-500" : ""
                  }`}
                  {...form.register("height", { valueAsNumber: true })}
                />
                <Label className="absolute left-4 top-2 text-xs font-medium text-gray-500 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary transition-all">
                  Height (cm)
                </Label>
                {form.formState.errors.height && (
                  <div className="mt-1 text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠</span>
                    {form.formState.errors.height.message}
                  </div>
                )}
              </div>

              {/* Activity Level Selection */}
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">Activity Level</Label>
                <Select
                  value={form.watch("activityLevel")}
                  onValueChange={(value) => form.setValue("activityLevel", value)}
                >
                  <SelectTrigger className={`h-14 text-lg ${
                    form.formState.errors.activityLevel ? "border-red-500" : ""
                  }`}>
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentary (little/no exercise)</SelectItem>
                    <SelectItem value="1.375">Lightly active (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="1.55">Moderately active (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="1.725">Very active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="1.9">Super active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.activityLevel && (
                  <div className="mt-1 text-sm text-red-500 flex items-center">
                    <span className="mr-1">⚠</span>
                    {form.formState.errors.activityLevel.message}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold transform hover:scale-[1.02] transition-all duration-200"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Daily Calories
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {showResults && calculationResult && (
          <Card id="resultsSection" className="shadow-lg mb-8">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Daily Calorie Recommendation</h2>
              </div>

              {/* Main Result */}
              <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white text-center mb-6">
                <div className="text-5xl font-bold mb-2">{calculationResult.dailyCalories.toLocaleString()}</div>
                <div className="text-xl opacity-90">calories per day</div>
              </div>

              {/* Calculation Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <HeartIcon className="text-primary mr-2 h-5 w-5" />
                    Base Metabolic Rate (BMR)
                  </h3>
                  <div className="text-2xl font-bold text-primary">{calculationResult.bmr.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">calories at rest</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Activity className="text-primary mr-2 h-5 w-5" />
                    Activity Multiplier
                  </h3>
                  <div className="text-2xl font-bold text-primary">{calculationResult.activityMultiplier}×</div>
                  <div className="text-sm text-gray-600">{calculationResult.activityDescription}</div>
                </div>
              </div>

              {/* Method Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <FlaskConical className="text-blue-600 mr-2 h-5 w-5" />
                  Calculation Method
                </h3>
                <p className="text-blue-800 text-sm mb-2">
                  This calculation uses the <strong>Mifflin-St Jeor equation</strong>, which is considered the most accurate method for estimating BMR:
                </p>
                <div className="bg-white rounded p-3 font-mono text-sm text-blue-900">
                  <div>{calculationResult.formula}</div>
                  <div className="mt-1 text-xs text-blue-700">
                    Daily Calories = BMR × Activity Factor ({calculationResult.activityMultiplier})
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
                  <Lightbulb className="text-yellow-600 mr-2 h-5 w-5" />
                  Important Notes
                </h3>
                <ul className="text-yellow-800 text-sm space-y-1">
                  <li>• This is an estimate based on population averages</li>
                  <li>• Individual metabolic rates can vary by ±10-15%</li>
                  <li>• Consult a healthcare professional for personalized advice</li>
                  <li>• Monitor your weight and adjust intake as needed</li>
                </ul>
              </div>

              {/* Reset Button */}
              <Button 
                type="button"
                onClick={resetCalculator}
                variant="outline"
                className="w-full mt-6 h-12 font-medium"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Calculate Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Method Information Section */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Info className="text-primary mr-2 h-6 w-6" />
              About the Mifflin-St Jeor Equation
            </h2>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 mb-4">
                The Mifflin-St Jeor equation is widely considered the most accurate method for calculating Basal Metabolic Rate (BMR). 
                It was developed in 1990 and has been validated through extensive research.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Men:</h3>
                  <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                    BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">For Women:</h3>
                  <div className="bg-gray-50 rounded p-3 font-mono text-sm">
                    BMR = (10 × weight) + (6.25 × height) - (5 × age) - 161
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                <strong>Variables:</strong> Weight in kg, Height in cm, Age in years
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
