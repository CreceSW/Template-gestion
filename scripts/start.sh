#!/bin/bash

# Script de inicio para Template Gestión
# Uso: ./scripts/start.sh [dev|prod|studio]

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Banner
echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════╗
║    TEMPLATE GESTIÓN - SISTEMA DOCKER  ║
║    Next.js 14 + PostgreSQL + Prisma   ║
╚════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Función para verificar si Docker está corriendo
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: Docker no está corriendo${NC}"
        echo -e "${YELLOW}Por favor inicia Docker Desktop y vuelve a intentar${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Docker está corriendo${NC}"
}

# Función para iniciar en modo desarrollo
start_dev() {
    echo -e "${BLUE}🚀 Iniciando en modo DESARROLLO...${NC}"
    echo ""

    # Verificar si ya está corriendo
    if docker ps | grep -q template-gestion-app-dev; then
        echo -e "${YELLOW}⚠️  La aplicación ya está corriendo${NC}"
        echo -e "${YELLOW}Ejecuta ./scripts/stop.sh primero si quieres reiniciar${NC}"
        exit 0
    fi

    # Iniciar servicios
    docker compose up -d --build

    echo ""
    echo -e "${GREEN}✓ Servicios iniciados correctamente${NC}"
    echo ""
    echo -e "${BLUE}📊 Estado de los servicios:${NC}"
    docker compose ps
    echo ""
    echo -e "${GREEN}🌐 Aplicación disponible en: ${NC}http://localhost:3000"
    echo -e "${GREEN}🗄️  PostgreSQL disponible en: ${NC}localhost:5432"
    echo ""
    echo -e "${YELLOW}📝 Ver logs en tiempo real:${NC}"
    echo -e "   npm run docker:dev:logs"
    echo ""
    echo -e "${YELLOW}🛑 Detener servicios:${NC}"
    echo -e "   ./scripts/stop.sh"
}

# Función para iniciar en modo producción
start_prod() {
    echo -e "${BLUE}🚀 Iniciando en modo PRODUCCIÓN...${NC}"
    echo ""

    # Verificar variables de entorno
    if [ ! -f .env ]; then
        echo -e "${RED}❌ Error: Archivo .env no encontrado${NC}"
        echo -e "${YELLOW}Copia .env.example a .env y configura las variables${NC}"
        exit 1
    fi

    # Iniciar servicios
    docker compose -f docker-compose.prod.yml up -d --build

    echo ""
    echo -e "${GREEN}✓ Servicios de producción iniciados${NC}"
    echo ""
    echo -e "${GREEN}🌐 Aplicación disponible en: ${NC}http://localhost:3000"
}

# Función para iniciar Prisma Studio
start_studio() {
    echo -e "${BLUE}🎨 Iniciando Prisma Studio...${NC}"
    echo ""

    # Verificar que la BD esté corriendo
    if ! docker ps | grep -q template-gestion-db; then
        echo -e "${YELLOW}⚠️  Base de datos no está corriendo${NC}"
        echo -e "${YELLOW}Iniciando servicios de desarrollo primero...${NC}"
        docker compose up -d postgres
        sleep 3
    fi

    docker compose --profile studio up -d prisma-studio

    echo ""
    echo -e "${GREEN}✓ Prisma Studio iniciado${NC}"
    echo -e "${GREEN}🎨 Studio disponible en: ${NC}http://localhost:5555"
    echo ""
    echo -e "${YELLOW}🛑 Detener Studio:${NC}"
    echo -e "   npm run docker:studio:stop"
}

# Función para mostrar ayuda
show_help() {
    echo -e "${YELLOW}Uso: ./scripts/start.sh [MODO]${NC}"
    echo ""
    echo "Modos disponibles:"
    echo "  dev      - Iniciar en modo desarrollo (default)"
    echo "  prod     - Iniciar en modo producción"
    echo "  studio   - Iniciar Prisma Studio"
    echo "  help     - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/start.sh dev"
    echo "  ./scripts/start.sh prod"
    echo "  ./scripts/start.sh studio"
}

# Verificar Docker
check_docker

# Procesar argumentos
MODE=${1:-dev}

case $MODE in
    dev)
        start_dev
        ;;
    prod)
        start_prod
        ;;
    studio)
        start_studio
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Modo no reconocido: $MODE${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
