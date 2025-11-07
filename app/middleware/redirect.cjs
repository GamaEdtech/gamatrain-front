export default function ({ route, redirect }) {
  var url = route.path
  var urlFirstSection = url.split('/')[1]

  if (urlFirstSection == 'page' || urlFirstSection == 'teacher')
    redirect(301, '/')
}
