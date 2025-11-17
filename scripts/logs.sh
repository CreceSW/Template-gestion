#!/bin/bash

# Script para ver logs de los contenedores
# Uso: ./scripts/logs.sh [app|db|all]

set -e

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para mostrar ayuda
show_help() {
    echo -e "${YELLOW}Uso: ./scripts/logs.sh [SERVICIO]${NC}"
    echo ""
    echo "Servicios disponibles:"
    echo "  app      - Ver logs de la aplicación Next.js (default)"
    echo "  db       - Ver logs de PostgreSQL"
    echo "  all      - Ver logs de todos los servicios"
    echo "  help     - Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./scripts/logs.sh"
    echo "  ./scripts/logs.sh app"
    echo "  ./scripts/logs.sh all"
    echo ""
    echo -e "${YELLOW}Presiona Ctrl+C para salir${NC}"
}

# Verificar que haya servicios corriendo
check_running() {
    if ! docker ps | grep -q template-gestion; then
        echo -e "${RED}❌ No hay servicios corriendo${NC}"
        echo -e "${YELLOW}Ejecuta ./scripts/start.sh primero${NC}"
        exit 1
    fi
}

# Procesar argumentos
SERVICE=${1:-app}

case $SERVICE in
    app)
        check_running
        echo -e "${BLUE}📝 Logs de la aplicación Next.js (Ctrl+C para salir)${NC}"
        echo ""
        docker compose logs -f app-dev
        ;;
    db)
        check_running
        echo -e "${BLUE}📝 Logs de PostgreSQL (Ctrl+C para salir)${NC}"
        echo ""
        docker compose logs -f postgres
        ;;
    all)
        check_running
        echo -e "${BLUE}📝 Logs de todos los servicios (Ctrl+C para salir)${NC}"
        echo ""
        docker compose logs -f
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}❌ Servicio no reconocido: $SERVICE${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
