import { Progress } from "./progress";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  if (!password) return null;

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    // let feedback = [];

    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Cap at 5
    strength = Math.min(5, strength);

    // Calculate percentage
    const percentage = (strength / 5) * 100;

    // Get strength text and color
    let strengthText = "";
    let strengthColor = "";
    
    if (strength <= 1) {
      strengthText = "Very Weak";
      strengthColor = "bg-red-500";
    } else if (strength <= 2) {
      strengthText = "Weak";
      strengthColor = "bg-orange-500";
    } else if (strength <= 3) {
      strengthText = "Fair";
      strengthColor = "bg-yellow-500";
    } else if (strength <= 4) {
      strengthText = "Strong";
      strengthColor = "bg-blue-500";
    } else {
      strengthText = "Very Strong";
      strengthColor = "bg-green-500";
    }

    return {
      percentage,
      strengthText,
      strengthColor,
    };
  };

  const { percentage, strengthText, strengthColor } = getPasswordStrength(password);

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Password strength</span>
        <span className={strengthColor.replace('bg-', 'text-')}>
          {strengthText}
        </span>
      </div>
      <Progress value={percentage} className={`h-1.5 ${strengthColor}`} />
      <ul className="text-xs text-muted-foreground space-y-1 mt-2">
        <li className={`flex items-center ${password.length >= 8 ? 'text-green-500' : ''}`}>
          {password.length >= 8 ? '✓' : '•'} At least 8 characters
        </li>
        <li className={`flex items-center ${/[A-Z]/.test(password) ? 'text-green-500' : ''}`}>
          {/[A-Z]/.test(password) ? '✓' : '•'} Uppercase letter
        </li>
        <li className={`flex items-center ${/[0-9]/.test(password) ? 'text-green-500' : ''}`}>
          {/[0-9]/.test(password) ? '✓' : '•'} Number
        </li>
        <li className={`flex items-center ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : ''}`}>
          {/[^A-Za-z0-9]/.test(password) ? '✓' : '•'} Special character
        </li>
      </ul>
    </div>
  );
}
