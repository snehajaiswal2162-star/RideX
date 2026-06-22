// import NextAuth from "next-auth"
// import Credentials from "next-auth/providers/credentials"
// import connectDB from "./lib/db"
// import userModel from "./models/UserModel"
// import bcrypt from "bcryptjs"
// import Google from "next-auth/providers/google"
 
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//   credentials: {
//     email: {
//       type: "email",
//       label: "Email",
//       placeholder: "johndoe@gmail.com",
//     },
//     password: {
//       type: "password",
//       label: "Password",
//       placeholder: "*****",
//     },
//   },
//   async authorize(credentials, request){
//     if(!credentials.email || !credentials.password){
//         throw new Error("MISSING CREDENTIALS")
//     }

//     const email = credentials.email as string
//     const password = credentials.password as string
//     await connectDB()

//     const user = await userModel.findOne({email})
//     if(!user) throw new Error("USER DON'T EXISTS!")

//     const isMatched = await bcrypt.compare(password,user.password)
//     if(!isMatched) throw new Error ("PASSWORD IS INCORRECT")
    
//     return {
//       id:user._id.toString(),
//       name:user.name,
//       email:user.email,
//       role:user.role,
//     }
//   }
// }),
//     Google({
//       clientId:process.env.AUTH_GOOGLE_ID,
//       clientSecret:process.env.AUTH_GOOGLE_SECRET
//     })
//   ],
//     callbacks:{
//       async signIn({user,account}){
//         if(account?.provider === "google"){
//           await connectDB()
//           let dbUser = await userModel.findOne({email:user.email})
//           if(!dbUser){
//             dbUser = await userModel.create({
//               name:user.name,
//               email:user.email,
//               role:'user'
//             })
//           }
//           user.id = dbUser._id.toString(),
//           user.role = dbUser.role
//         }
//         return true
//       },

//       async jwt({token,user}){
//         if(user){
//           token.name = user.name,
//         token.id = user.id?.toString(),
//         token.email = user.email,
//         token.role = user.role
//         }
//         return token
//       },

//       async session({token,session}){
//         if(session.user){
//           session.user.name = token.name,
//           session.user.id = token.id as string,
//           session.user.email = token.email as string,
//           session.user.role = token.role as string
//         }
//         return session
//       }
//     },

//     pages:{
//         signIn:'/signin',
//         error:'/signin'
//       },

//       session:{
//         strategy:'jwt',
//         maxAge:10*24*60*60
//       },

//       secret:process.env.AUTH_SECRET
// })

import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import userModel from "./models/UserModel"
import bcrypt from "bcryptjs"
import Google from "next-auth/providers/google"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },

      async authorize(credentials, request){
        try {
          if(!credentials.email || !credentials.password){
            throw new Error("MISSING CREDENTIALS")
          }

          const email = credentials.email as string
          const password = credentials.password as string

          await connectDB()

          const user = await userModel.findOne({email})

          if(!user) throw new Error("USER DON'T EXISTS!")

          const isMatched = await bcrypt.compare(password,user.password)

          if(!isMatched) throw new Error ("PASSWORD IS INCORRECT")
          

          return {
            id:user._id.toString(),
            name:user.name,
            email:user.email,
            role:user.role,
          }

        } catch (err) {
          throw err
        }
      }
    }),

    Google({
      clientId:process.env.AUTH_GOOGLE_ID,
      clientSecret:process.env.AUTH_GOOGLE_SECRET
    })
  ],

  callbacks:{
    async signIn({user,account}){
      try {
        if(account?.provider === "google"){

          if(!user.email){
            throw new Error("No email from Google")
          }

          await connectDB()

          let dbUser = await userModel.findOne({email:user.email})

          if(!dbUser){
            dbUser = await userModel.create({
              name:user.name,
              email:user.email,
              role:'user',
              isEmailVerified:true
            })
          }


          user.id = dbUser._id.toString()
          user.role = dbUser.role
        }

        return true

      } catch (err) {
          console.error("SIGNIN ERROR:", err)
        return false
      }
    },

    async jwt({token,user}){
       if (user) {
    token.name = user.name
    token.id = user.id?.toString()
    token.email = user.email
    token.role = user.role
  }

  // ✅ ALWAYS sync latest role from DB
  if (token.email) {
    await connectDB()
    const dbUser = await userModel.findOne({ email: token.email })

    if (dbUser) {
      token.role = dbUser.role
      token.id = dbUser._id.toString()
    }
  }
      return token
    },

    async session({token,session}){

      if(session.user){
        session.user.name = token.name
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.role = token.role as string
      }

      return session
    }
  },

  pages:{
    signIn:'/signin',
    error:'/signin'
  },

  session:{
    strategy:'jwt',
    maxAge:10*24*60*60
  },

  secret:process.env.AUTH_SECRET
})