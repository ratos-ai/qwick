#!/bin/bash

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}=== НАЧАЛО ОЧИСТКИ ===${NC}"
echo -e "До очистки:"
df -h / | tail -1

echo -e "\n${YELLOW}1. Очистка Docker (без удаления volumes с данными)...${NC}"
docker system prune -af
docker builder prune -af

echo -e "\n${YELLOW}2. Очистка кэша APT...${NC}"
sudo apt-get autoremove -y
sudo apt-get clean

echo -e "\n${YELLOW}3. Очистка логов systemd (оставляем последние 7 дней)...${NC}"
sudo journalctl --vacuum-time=7d

echo -e "\n${YELLOW}4. Очистка временных файлов (/tmp)...${NC}"
sudo rm -rf /tmp/* 2>/dev/null || true

echo -e "\n${GREEN}=== ОЧИСТКА ЗАВЕРШЕНА ===${NC}"
echo -e "После очистки:"
df -h / | tail -1