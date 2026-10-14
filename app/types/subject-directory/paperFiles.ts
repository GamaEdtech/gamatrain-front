export type DirectoryFileAvailability = boolean | number | string | null

export interface DirectoryFileInfo {
  exist?: DirectoryFileAvailability
  price?: number | string | null
}

export interface DirectoryExtraFile extends DirectoryFileInfo {
  id?: string | number | null
  type?: string | number | null
  type_title?: string | null
}

export interface DirectoryPaperFileSource {
  files?: {
    pdf?: DirectoryFileInfo
    answer?: DirectoryFileInfo
    extra?: DirectoryExtraFile[] | null
  } | null
  q_file?: DirectoryFileAvailability
  a_file?: DirectoryFileAvailability
  in_file?: DirectoryFileAvailability
  in_file_id?: string | number | boolean | null
  sf_file?: DirectoryFileAvailability
  sf_file_id?: string | number | boolean | null
}

export interface DirectoryPaper extends DirectoryPaperFileSource {
  id: string | number
  title?: string
  title_url?: string
  test_type_title?: string
  lesson_title?: string
  variant?: string | number | null
  variant_title?: string | null
  exam_id?: string | (string | number)[] | null
}

export interface DirectoryPaperDownload {
  type: string
  title: string
  shortTitle: string
  icon: string
  style: 'question' | 'answer' | 'extra'
  price: number | null
  extraId?: string
}

export interface DirectoryDownloadParams {
  type: 'pdf' | 'answer' | 'extra'
  extraId?: string
}
