PATH=$PATH:$HOME/.volta/bin

git checkout .
git pull origin main

pnpm install
pnpm build

for PID in $(ps -e -o pid,cmd | grep pnpm | grep start-short-links | awk '{print $1}'); do
  kill $PID
done

nohup pnpm start-short-links &
