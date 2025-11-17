#!/bin/bash

# Script de detención para Template Gestión
# Uso: ./scripts/stop.sh [dev|prod|all|clean]

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
║    DETENIENDO SERVICIOS DOCKER        ║
╚════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Función para detener desarrollo
stop_dev() {
    echo -e "${YELLOW}🛑 Deteniendo servicios de DESARROLLO...${NC}"
    echo ""

    docker-compose down

    echo ""
    echo -e "${GREEN}✓ Servicios de desarrollo detenidos${NC}"
}

# Función para detener producción
stop_prod() {
    echo -e "${YELLOW}🛑 Deteniendo servicios de PRODUCCIÓN...${NC}"
    echo ""

    docker-compose -f docker-compose.prod.yml down

    echo ""
    echo -e "${GREEN}✓ Servicios de producción detenidos${NC}"
}

# Función para detener todo
stop_all() {
    echo -e "${YELLOW}🛑 Deteniendo TODOS los servicios...${NC}"
    echo ""

    # Detener Prisma Studio si está corriendo
    docker-compose --profile studio down 2>/dev/null || true

    # Detener desarrollo
    docker-compose down 2>/dev/null || true

    # Detener producción
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    echo ""
    echo -e "${GREEN}✓ Todos los servicios detenidos${NC}"
}

# Función para limpiar todo (incluyendo volúmenes)
clean_all() {
    echo -e "${RED}⚠️  ADVERTENCIA: Esto eliminará TODOS los datos de la base de datos${NC}"
    echo -e "${YELLOW}¿Estás seguro? (y/N): ${NC}"
    read -r response

    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo ""
        echo -e "${YELLOW}🧹 Limpiando todos los contenedores y volúmenes...${NC}"
        echo ""

        # Detener y eliminar todo incluyendo volúmenes
        docker-compose --profile studio down -v 2>/dev/null || true
        docker-compose down -v 2>/dev/null || true
        docker-compose -f docker-compose.prod.yml down -v 2>/dev/null || true

        echo ""
        echo -e "${GREEN}✓ Limpieza completada${NC}"
        echo -e "${YELLOW}ℹ️  Los datos de la base de datos han sido eliminados${NC}"
    else
        echo ""
        echo -e "${BLUE}Operación cancelada${NC}"
    fi
}

# Función para mostrar ayuda
show_help() {
    echo -e "${YELLOW}Uso: ./scripts/stop.sh [MODO]${NC}"
    echo ""
    echo "Modos disponibles:"
    echo "  dev      - Detener servicios de desarrollo (default)"
    echo "  prod     - Detener servicios de producción"
    echo "  all      - Detener todos los servicios"
    echo "  clean    - Detener y eliminar todos los datos (⚠️  destructivo)"
    echo "  help     - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/stop.sh"
    echo "  ./scripts/stop.sh all"
    echo "  ./scripts/stop.sh clean"
}

# Procesar argumentos
MODE=${1:-dev}

case $MODE in
    dev)
        stop_dev
        ;;
    prod)
        stop_prod
        ;;
    all)
        stop_all
        ;;
    clean)
        clean_all
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
