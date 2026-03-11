A=https://github.com/OpenBMB/ChatDev.git
B=https://github.com/Genlovy-Hoo/ChatDev.git
git fetch upstream
git rebase upstream/main
# 若有冲突，先解决，然后
# git add 解决的冲突文件
# git rebase --continue
git push origin main --force-with-lease
