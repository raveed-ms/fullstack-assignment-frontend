export function useUserRole() {
  // Get color based on user role
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'accent';
      case 'mod':
        return 'primary';
      default:
        return 'primary';
    }
  };

  return {
    getRoleColor
  };
}
