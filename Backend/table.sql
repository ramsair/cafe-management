
create table user(
    id int primary key AUTO_INCREMENT,
    name Varchar(250),
    contactNumber Varchar(20),
    email Varchar(50),
    password Varchar(250),
    status Varchar(20),
    role Varchar(20),
    UNIQUE (email)

);
insert into user(name, contactNumber, email,password,status,role) values('Admin','123456789','admin@gmail.com', 'admin','true','admin' );


create table category(
    id int NOT NULL AUTO_INCREMENT,
    name Varchar(255) NOT NULL,
    primary key(id)
);

create table product(
    id int NOT NULL AUTO_INCREMENT,
    name Varchar(255) NOT NULL,
    categoryId integer NOT NULL,
    description Varchar(255),
    price integer,
    status Varchar(20),
    primary key(id)
);

create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid Varchar(200) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total int NOT NULL ,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key(id)
);