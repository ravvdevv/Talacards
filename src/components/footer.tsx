export function Footer() {
  return (
    <footer className="border-t py-6 text-center">
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Talacards. All rights reserved.
      </p>
    </footer>
  )
}