echo "Downloading JS"
git clone https://github.com/Goldn7799/MyShell.git
cd MyShell
echo "installing requirement"
sudo apt install node npm -y
npm i
echo "Removing Template"
rm -rf .git
rm .gitgone
rm README.md
echo "Done, Start with cd MyShell and run npm start"
