#!/bin/bash

users=("darg" "test")
for user in "${users[@]}"; do
  mkdir -p Build/Server/Home/$user/{scheduler,simulator,platform,generator}
  node Build/Server/User/CreateUser.js "$user"
done



