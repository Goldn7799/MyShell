echo "BackUp"
cp ./db.json ../
cp ./history.json ../
rm -rf .
echo "installing requirement"
sudo apt install nodejs npm wget git
echo "Downloading JS"
git clone https://github.com/Goldn7799/MyShell.git
npm i
echo "Removing Template"
rm -rf .git
rm .gitignore
rm README.md
rm update.sh
rm install.sh
echo "Restore Backup"
cp ../db.json ./
cp ../history.json ./
rm ../db.json
rm ../db.json
echo "Done, Start with cd MyShell and run npm start"
