import { UserLevel } from "@prisma/client";
import Fuse from "fuse.js";

export default new Fuse(Object.values(UserLevel))

export const levelSearch = new Fuse(Object.values(UserLevel).filter(val=>val!=='SUPER_TEACHER'))