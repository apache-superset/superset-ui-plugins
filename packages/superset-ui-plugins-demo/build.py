from os import chdir, system

chdir("../../")
system("sudo yarn build")
chdir("packages/superset-ui-plugins-demo")
system("sudo yarn storybook")
