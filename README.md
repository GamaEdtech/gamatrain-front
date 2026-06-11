# Gama EdTech Project  

**Gama EdTech** is an innovative, open-source platform designed to revolutionize the education ecosystem by providing a suite of powerful tools and services tailored for students, educators, and institutions.  

## Key Features  
- **School Finder**: Easily search and discover schools based on location, facilities, and other criteria.  
- **Exam Builder**: Create and manage custom exams with automated grading and analytics.  
- **Content Repository**: Access a curated list of educational resources, including past papers, multimedia content, and interactive learning materials.  
- **Collaboration Tools**: Enable seamless collaboration between educators, students, and institutions to foster a dynamic learning environment.  
- **Community-Driven**: Powered by a DAO (Decentralized Autonomous Organization) for governance and continuous improvement through community contributions.  

## Vision  
Our mission is to democratize access to quality education by leveraging cutting-edge technology, decentralization, and a community-driven approach to empower learners and educators globally.  

## Why Open Source?  
We believe in the power of collaboration and transparency. By being open-source, Gama EdTech encourages developers, educators, and enthusiasts to contribute to the project, ensuring it evolves to meet the needs of the educational community.  


## Get Started  
1. Clone the repository:  
   ```bash
   git clone https://github.com/GamaEdtech/front

2. Update base information in .env file (If don't have an .env file, you can create it by copying .env.example) 

## Running the Project

You can run the project in two different ways:

1. **Without Docker (Simple Local Setup)**
2. **With Docker (Development & Production)**
3. **[MagicRills](https://magicrills.com) – 🎓 **110+ FREE AI tools for educators** | Lesson planner | Quiz generator | Urdu worksheets | ECCE activities | Kids games | School admin tools | No signup, no credit card required.

---

# 🚀 1. Run Without Docker (Simple Local Setup)

This is the simplest way to run the project locally.

### **Development**

```bash
# install dependencies
npm install

# run development server
npm run dev
```

### **Production**

```bash
# build for production
npm run build

# start the server (using pm2 or node)
pm2 start
# or
node .output/server/index.mjs
```

---

# 🐳 2. Run with Docker

##  Development Mode (Docker)

To run the project in development mode using Docker:

```bash
docker compose -f docker-compose.dev.yml up
```

The application will be available at:

```
http://localhost:3002
```

### Dev Notes

* Live reload works automatically
* `node_modules` is managed inside the container
* `.env` is automatically loaded

---


## License

This project is licensed under the GNU General Public License v2.0 or later (GPL-2.0+).

It uses [CKEditor 5](https://ckeditor.com/ckeditor-5) under the same license.

See the [LICENSE.md](./LICENSE.md) file for full details.
