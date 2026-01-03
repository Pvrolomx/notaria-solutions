#!/usr/bin/env python3
"""Genera iconos PWA para Notaria Solutions"""
from PIL import Image
import os

# Ruta del logo original
logo_path = '/home/pvrolo/notaria-solutions/logo.jpeg'
output_dir = '/home/pvrolo/notaria-solutions'

# Cargar imagen
img = Image.open(logo_path)

# Convertir a RGBA si es necesario
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Tamaños necesarios para PWA
sizes = [192, 512]

for size in sizes:
    # Crear copia y redimensionar
    icon = img.copy()
    icon = icon.resize((size, size), Image.LANCZOS)
    
    # Guardar como PNG
    output_path = os.path.join(output_dir, f'icon-{size}.png')
    icon.save(output_path, 'PNG')
    print(f'Creado: {output_path}')

print('Iconos PWA generados!')
