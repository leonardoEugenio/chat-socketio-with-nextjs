export function Topbar() {
  return (
    <div className="bg-white border-b border-gray-300 sticky top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">
          Chat socket.io{' '}
          <strong className="bg-gray-900 p-2 rounded-ee-3xl rounded-ss-3xl text-white">
            Next-15
          </strong>
        </h1>
      </div>
    </div>
  )
}
