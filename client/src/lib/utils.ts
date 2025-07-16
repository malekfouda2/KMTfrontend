import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getUserDisplayName(user: any): string {
  if (!user) {
    console.warn('getUserDisplayName called with null/undefined user');
    return "Unknown User";
  }
  
  // Log the user object to debug structure
  console.log('getUserDisplayName called with user:', user);
  
  // Try different name formats based on common API patterns
  if (user.fullName) return user.fullName;
  if (user.name) return user.name;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.lastName) return user.lastName;
  if (user.displayName) return user.displayName;
  if (user.username) return user.username;
  if (user.email) return user.email;
  if (user.phoneNumber) return user.phoneNumber;
  if (user.id) return `User ${user.id}`;
  
  // If all else fails, show object keys for debugging
  console.warn('Could not determine user display name. User object keys:', Object.keys(user));
  return "Unknown User";
}
