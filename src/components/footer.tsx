export function Footer() {
  return (
    <footer className="py-6 mt-12 border-t">
      <div className="container mx-auto text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Pancreas Vision. All rights reserved.</p>
        <p className="text-xs mt-1">This tool is for informational purposes only and not a substitute for professional medical advice.</p>
      </div>
    </footer>
  );
}
