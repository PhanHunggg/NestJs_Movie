import { async } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { CreateQuanLyRapDto } from './dto/create-quan-ly-rap.dto';
import { UpdateQuanLyRapDto } from './dto/update-quan-ly-rap.dto';
import { PrismaClient, movie } from '@prisma/client';
import { errCode, failCode, successCode } from 'src/config/response';

@Injectable()
export class QuanLyRapService {

  prisma = new PrismaClient()

  async getTheaterSystem(res: any) {
    const theaterSystemList = await this.prisma.heThongRap.findMany()

    successCode(res, theaterSystemList, "Xử lí thành công")
  }

  async getTheaterClusterSystem(res: any, maHeThongRap: string) {
    const theaterSystemList = await this.prisma.heThongRap.findFirst(
      {
        where: {
          ma_he_thong_rap: Number(maHeThongRap)
        },
        include: {
          cumRap: {
            include: {
              rapPhim: true
            }
          },
        }

      }
    )

    successCode(res, theaterSystemList, "Xử lí thành công")
  }

  async getShowtimeSystem(res: any, maHeThongRap: string) {
   try {
    const checkShowtime = await this.prisma.heThongRap.findFirst({
      where: {
        ma_he_thong_rap: Number(maHeThongRap)
      },
      include: {
        cumRap: {
          include: {
            rapPhim: {
              include: {
                lichChieu: {
                  include: {
                    movie: true
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!checkShowtime) errCode(res, maHeThongRap, "Xử lí thất bại")


    successCode(res, checkShowtime, "Xử lí thành công")
   } catch (error) {
    failCode(res, error.message)
   }
  }

  async getShowtimeDetail(res: any, maPhim: string){
    const checkMovie = await this.prisma.movie.findFirst({
      where: {
        ma_phim: Number(maPhim)
      },
      include: {
        lichChieu: true
      }
    })

    if(!checkMovie) errCode(res, maPhim, "Xử lí thất bại")

    successCode(res, checkMovie, "Xử lí thành công")
  }
}
