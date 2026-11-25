export interface UploadFileDTO {
  file: {
    name: string
  }
  /** What an uploaded past paper PDF says about itself (see `PaperDetectionDTO`). */
  detected?: import('../pastpaper').PaperDetectionDTO
}
