from pathlib import Path

path = Path("components/site-header.tsx")
text = path.read_text(encoding="utf-8")

old_mobile = '{ label: "Consultar", href: "/alertas", icon: "alert" },'
new_mobile = '{ label: "Alertas", href: "/alertas", icon: "alert" },'

old_normal = '''  normal: {
    eyebrow: "Avisos oficiais",
    label: "Alertas",
    ariaLabel: "Consultar avisos meteorológicos para Pelotas",
  },'''
new_normal = '''  normal: {
    eyebrow: "Avisos oficiais",
    label: "Consultar",
    ariaLabel: "Consultar avisos meteorológicos para Pelotas",
  },'''

for old, new in ((old_mobile, new_mobile), (old_normal, new_normal)):
    if old not in text:
        raise SystemExit(f"Trecho não encontrado: {old!r}")
    text = text.replace(old, new, 1)

path.write_text(text, encoding="utf-8")
print("Header copy corrected.")
