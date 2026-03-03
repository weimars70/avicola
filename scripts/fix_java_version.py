import os
import re

# Configuración de rutas
ANDROID_DIR = r"d:\galpones\avicola\frontend\src-capacitor\android"
NODE_MODULES_CAP = r"d:\galpones\avicola\frontend\node_modules\@capacitor\android\capacitor\build.gradle"

def patch_file(file_path, search_pattern, replacement, description):
    if not os.path.exists(file_path):
        print(f"SKIPPED: {description} (Archivo no encontrado: {file_path})")
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if search_pattern in content:
        new_content = content.replace(search_pattern, replacement)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"PATCHED: {description}")
        return True
    else:
        print(f"NOT NEEDED: {description} (Patrón no encontrado)")
        return False

def main():
    print("Iniciando parcheo de versión de Java...")

    # 1. Parchear app/capacitor.build.gradle (Generado por Capacitor)
    capacitor_build = os.path.join(ANDROID_DIR, "app", "capacitor.build.gradle")
    patch_file(
        capacitor_build,
        "JavaVersion.VERSION_21",
        "JavaVersion.VERSION_17",
        "Versión de Java en app/capacitor.build.gradle"
    )

    # 2. Parchear node_modules para evitar que la librería pida Java 21
    patch_file(
        NODE_MODULES_CAP,
        "JavaVersion.VERSION_16", # He notado que está en 16, pero forzamos 17 para seguridad
        "JavaVersion.VERSION_17",
        "Versión de Java en node_modules"
    )
    # También buscando por si acaso el 21 en node_modules
    patch_file(
        NODE_MODULES_CAP,
        "JavaVersion.VERSION_21",
        "JavaVersion.VERSION_17",
        "Versión de Java (21->17) en node_modules"
    )

    # 3. Limpiar flags --release que interfieren con AGP
    gradle_files_to_clean = [
        os.path.join(ANDROID_DIR, "build.gradle"),
        os.path.join(ANDROID_DIR, "app", "build.gradle")
    ]
    
    release_pattern = re.compile(r"options\.compilerArgs\.addAll\(\['--release', '17'\]\)")
    
    for g_file in gradle_files_to_clean:
        if os.path.exists(g_file):
            with open(g_file, 'r', encoding='utf-8') as f:
                lines = f.readlines()
            
            new_lines = [line for line in lines if "--release" not in line]
            
            if len(new_lines) != len(lines):
                with open(g_file, 'w', encoding='utf-8') as f:
                    f.writelines(new_lines)
                print(f"CLEANED: Removido flag --release de {os.path.basename(g_file)}")

    print("Parcheo y limpieza completados.")

if __name__ == "__main__":
    main()
