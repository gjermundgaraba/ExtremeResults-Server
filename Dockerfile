FROM node:4-onbuild
RUN npm install
EXPOSE 4321
CMD ["npm", "start"]
