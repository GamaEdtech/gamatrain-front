import cieIcon from '~/assets/images/boards/CIE.svg'
import edexcelIcon from '~/assets/images/boards/Edexcel.svg'
import AQAIcon from '~/assets/images/boards/AQA.svg'
import OCRIcon from '~/assets/images/boards/OCR.svg'
import GamaIcon from '~/assets/images/boards/Gama.svg'
import ScientificIcon from '~/assets/images/boards/Scientific Competition.svg'
import cxcIcon from '~/assets/images/boards/CXC.svg'
import kangarooIcon from '~/assets/images/boards/Kangaroo.svg'
import nijeriaIcon from '~/assets/images/boards/Nijeria.svg'
import turkiyeIcon from '~/assets/images/boards/Turkiye.svg'

export const useBoard = () => {
  const boardImgs = [
    cieIcon,
    edexcelIcon,
    AQAIcon,
    OCRIcon,
    GamaIcon,
    cxcIcon,
    nijeriaIcon,
    turkiyeIcon,
    ScientificIcon,
    kangarooIcon,
  ]

  return { boardImgs }
}
