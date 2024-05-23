rm -rf ~/.cache
du -sh /var/log
rm -rf ~/tmp
apt-get autoremove
sudo du -sh /var/cache/apt
sudo journalctl --vacuum-time=3d
