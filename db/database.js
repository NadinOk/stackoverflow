 const Sequelize = require('sequelize');


DB_USER='usof'
DB_PASSWORD='nadin1009'
DB_DATABASE='usof'

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,

    })

const category = sequelize.define('category_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const comment = sequelize.define('comment_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    }
});

const like = sequelize.define('like_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    author: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    publish_date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    post_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    comment_id: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    type_like: {
        type: Sequelize.ENUM,
        values: ['like', 'dislike'],
        allowNull: false
    }
})

const post = sequelize.define('post_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    // author: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false
    // },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    publish_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: true
    },
    content: {
        type: Sequelize.TEXT,
        allowNull:false
    },
    categories: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

const token = sequelize.define('token_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false
    },
    expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

const user = sequelize.define('user_entity', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    login: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    full_name: {
        type: Sequelize.STRING,
        allowNull: true
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        isEmail: true,
        allowNull: false
    },
    profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    rating: {
        type: Sequelize.INTEGER,
        defaultValue: "0",
        allowNull: false
    },
    role: {
        type: Sequelize.STRING,
        defaultValue: "user",
        allowNull: false
    },
    confirmCode: {
        type: Sequelize.STRING,
        allowNull: false
    },
    is_confirm: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    resetToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    expires: {
        type: Sequelize.DATE,
    },
});

post.hasMany(like, {
    foreignKey: 'post_id'
})

post.hasMany(comment, {
    foreignKey: 'post_id'
})

// post.hasOne(user, {foreignKey})


comment.hasMany(like, {
    foreignKey: 'comment_id'
})


user.hasMany(comment, {
    foreignKey: 'author', sourceKey: 'id', as: 'CommentAuthor'
})
comment.belongsTo(user, {foreignKey: 'author', targetKey: 'id', as: 'CommentAuthor'})


user.hasMany(post, {
    foreignKey: 'author', sourceKey: 'id', as: 'Author'
})
post.belongsTo(user, {foreignKey: 'author', targetKey: 'id', as: 'Author'})

// user.hasMany(like, {
//     foreignKey: 'author'
// })

user.hasMany(token, {
    foreignKey: 'user_id'
})



module.exports = { sequelize, category, comment, like, post, token, user };
