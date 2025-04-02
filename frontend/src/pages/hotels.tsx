import { useRouter } from 'next/router';

export default function Hotels() {
  const router = useRouter();
  const { eventId } = router.query;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div>
        <h1 className="text-2xl font-bold mb-4">Hotel Selection</h1>
        {eventId ? (
          <p>Selected Event ID: {eventId}</p>
        ) : (
          <p>No event selected.</p>
        )}
        <p>This is a placeholder page for hotel selection.</p>
      </div>
    </div>
  );
}
