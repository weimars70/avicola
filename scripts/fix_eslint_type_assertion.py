import os

def fix_type_assertion():
    file_path = r'd:\galpones\avicola\frontend\src\stores\inversionInicial.ts'
    
    if not os.path.exists(file_path):
        print(f"Error: El archivo {file_path} no existe.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # Línea 158 (indice 157 en Python 0-indexed)
    # 158:         tipo: (ingreso.tipo === 'venta' ? 'venta' : 'ingreso') as 'venta' | 'ingreso'
    target_pattern = "tipo: (ingreso.tipo === 'venta' ? 'venta' : 'ingreso') as 'venta' | 'ingreso'"
    replacement = "tipo: ingreso.tipo === 'venta' ? 'venta' : 'ingreso'"
    
    found = False
    for i, line in enumerate(lines):
        if target_pattern in line:
            lines[i] = line.replace(target_pattern, replacement)
            found = True
            print(f"Cambio aplicado en la línea {i+1}")
            break
            
    if not found:
        print("No se encontró el patrón específico en la línea 158. Buscando por contenido similar...")
        # Búsqueda más flexible
        for i, line in enumerate(lines):
            if "tipo: (ingreso.tipo === 'venta' ? 'venta' : 'ingreso')" in line and "as 'venta' | 'ingreso'" in line:
                lines[i] = line.replace(" (", " ").replace(") as 'venta' | 'ingreso'", "")
                found = True
                print(f"Cambio flexible aplicado en la línea {i+1}")
                break

    if found:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print("Archivo guardado exitosamente.")
    else:
        print("No se pudo aplicar la corrección. Verifica el contenido del archivo.")

if __name__ == "__main__":
    fix_type_assertion()
