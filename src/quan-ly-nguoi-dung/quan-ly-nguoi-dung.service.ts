
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignUpInterface, loginInterFace } from './interface/user';
import { errCode, successCode } from 'src/config/response';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/create-quan-ly-nguoi-dung.dto';
import { check } from 'prettier';

@Injectable()
export class QuanLyNguoiDungService {

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) { }

  prisma = new PrismaClient();

  async login(res, user: loginInterFace) {
    const checkUser = await this.prisma.nguoiDung.findFirst({
      where: {
        tai_khoan: user.tai_khoan
      }
    })

    if (!checkUser) {
      errCode(res, user, "Tài khoản không đúng!")
      return
    }

    if (checkUser.mat_khau !== user.mat_khau) {
      errCode(res, user, "Mật khẩu không đúng!");
      return
    }

    const token = this.jwtService.sign({ data: checkUser }, { secret: this.config.get("SECRET_KEY"), expiresIn: "30m" })

    let data: UserDto = checkUser

    data.accessToken = token

    successCode(res, data, "Đăng nhập thành công")

  }
  async signUp(res: any, user: SignUpInterface) {

    const checkEmail = await this.prisma.nguoiDung.findFirst({
      where: {
        email: user.email
      }
    })

    if (checkEmail) {
      errCode(res, user, "Email đã tồn tại")
      return
    }

    const checkAccount = await this.prisma.nguoiDung.findFirst({
      where: {
        tai_khoan: user.tai_khoan
      }
    })

    if (checkAccount) {
      errCode(res, user, "Tài khoản đã tồn tại")
      return
    }

    user.loai_nguoi_dung = "KhachHang"

    await this.prisma.nguoiDung.create({
      data: user
    })

    successCode(res, user, "Đăng ký thành công")


  }

  async userType(res: any) {
    const data = [
      {
        maLoaiNguoiDung: "KhachHang",
        tenLoai: "Khách hàng"
      },

      {
        maLoaiNguoiDung: "QuanTri",
        tenLoai: "Quản Trị"
      },
    ]
    successCode(res, data, "Xử lý thành công!")
  }

  async userList(res: any) {
    const userList = await this.prisma.nguoiDung.findMany()

    successCode(res, userList, "Xử lí thành công!")
  }

  async addUser(res: any, user: SignUpInterface) {
    try {
      const checkEmail = await this.prisma.nguoiDung.findFirst({
        where: {
          email: user.email
        }
      })

      if (checkEmail) {
        errCode(res, user, "Email đã tồn tại!")
        return
      }

      const checkAccount = await this.prisma.nguoiDung.findFirst({
        where: {
          tai_khoan: user.tai_khoan
        }
      })

      if (checkAccount) {
        errCode(res, user, "Tài khoản đã tồn tại!")
        return
      }

      if (user.loai_nguoi_dung === "KhachHang" || user.loai_nguoi_dung === "QuanTri") {
        await this.prisma.nguoiDung.create({
          data: user
        })

        successCode(res, user, "Thêm thành công")
      } else {
        errCode(res, user, "Không có hoặc sai loại người dùng")
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }

  async findUser(res: any, username: string) {
    try {
      const checkUser = await this.prisma.nguoiDung.findFirst({
        where: {
          tai_khoan: username,
        }
      })
      successCode(res, checkUser, "Xử lí thành công")
    } catch (error) {
      throw new Error(error.message)
    }

  }

  async updateUser(res: any, user: SignUpInterface, id: string) {
    try {
      const checkUser = await this.prisma.nguoiDung.findFirst({
        where: {
          ma_nguoi_dung: Number(id),
        }
      })

      if (!checkUser) {
        errCode(res, id, "Không tìm thấy người dùng!")
        return
      }


      await this.prisma.nguoiDung.update({
        data: user,
        where: {
          ma_nguoi_dung: Number(id)
        }
      })
      successCode(res, user, "Cập nhật người dùng thành công")
    } catch (error) {
      throw new Error(error.message)

    }
  }

  async getUserDetail(res: any, maNguoiDung: string){
    const checkUser = await this.prisma.nguoiDung.findFirst({
      where: {
        ma_nguoi_dung: Number(maNguoiDung)
      },
      include: {
        datVe: {
          include: {
            lichChieu: {
              include: {
                movie: true
              }
            }
          }
        }
      }
    })

    if(!checkUser){
      errCode(res, maNguoiDung, "Không tìm thấy người dùng")
      return
    }

    successCode(res, checkUser, "Xử lí thành công")

  }

  async deleteUser(res: any, maNguoiDung: string) {

    const checkUser = await this.prisma.nguoiDung.findFirst({
      where: {
        ma_nguoi_dung: Number(maNguoiDung),
      }
    })

    if (!checkUser) {
      errCode(res, maNguoiDung, "Không tìm thấy người dùng")
      return
    }

    const checkTicket = await this.prisma.datVe.findFirst({
      where: {
        ma_nguoi_dung: Number(maNguoiDung)
      }
    })

    if (checkTicket) {
      errCode(res, checkTicket, "Không thể xóa người dùng")
      return
    }

    await this.prisma.nguoiDung.delete({
      where: {
        ma_nguoi_dung: Number(maNguoiDung)
      }
    })
    successCode(res, checkUser, "Xử lí thành công")

  }




}
