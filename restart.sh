git checkout .
git pull origin main
yarn install
yarn build

for PID in $(ps -e -o pid,cmd | grep yarn | grep start-short-links | awk '{print $1}'); do
  kill $PID
done

nohup yarn start-short-links &
