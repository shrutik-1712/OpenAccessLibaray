import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Book, Users, Eye, Target } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdvisoryMember {
  name: string;
  image: string;
  description: string;
}

interface TeamMember {
  name: string;
  image: string;
  role: string;
  description: string;
}

const About = () => {
  const [advisoryCommittee, setAdvisoryCommittee] = useState<AdvisoryMember[]>([]);
  const [libraryTeam, setLibraryTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [committeeResponse, teamResponse] = await Promise.all([
          fetch('http://localhost:3001/api/advisoryCommittee'),
          fetch('http://localhost:3001/api/libraryTeam')
        ]);

        if (!committeeResponse.ok || !teamResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const committeeData = await committeeResponse.json();
        const teamData = await teamResponse.json();

        setAdvisoryCommittee(committeeData);
        setLibraryTeam(teamData);
      } catch (err) {
        setError('Failed to load team data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to construct full image URL
  const getImageUrl = (imagePath: string) => {
    return `http://localhost:3001${imagePath}`;
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-bold mb-8 text-center">About Dina Bama Patil Pratishthan Library</h1>
      
      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-6 flex items-center">
          <Book className="mr-2" /> Our Initiative
        </h2>
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-8">
            <p className="text-lg leading-relaxed">
              Dina Bama Patil Pratishthan is proud to organize a place of comfort for students preparing for various exams, including 10th, 12th, Degree, IAS, and other competitive exams. This library and study space was inaugurated on the occasion of the birth anniversary of Late Dina Bama Patil.
            </p>
          </CardContent>
        </Card>
      </section>

      <Separator className="my-12" />

      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <section>
          <h2 className="text-3xl font-semibold mb-6 flex items-center">
            <Eye className="mr-2" /> Our Vision
          </h2>
          <Card className="h-full shadow-lg">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                The vision of DBPL is to be an institution of excellence in higher education that continually responds to changing social realities through the development and application of knowledge, towards creating a people-centered, ecologically sustainable and just society that promotes and protects dignity, equality, social justice and human rights for all.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-6 flex items-center">
            <Target className="mr-2" /> Our Mission
          </h2>
          <Card className="h-full shadow-lg">
            <CardContent className="p-8">
              <p className="text-lg leading-relaxed">
                "Provide essential and specialized information support to users by procuring and organizing information resources, providing human and technologically moderated access to knowledge and aiding users to identify, locate, obtain and evaluate information."
              </p>
            </CardContent>
          </Card>
        </section>
      </div>

      <Separator className="my-12" />

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">{error}</div>
      ) : (
        <>
          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 flex items-center">
              <Users className="mr-2" /> Library Advisory Committee
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {advisoryCommittee.map((member, index) => (
                <Card key={index} className="p-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <img 
                        src={getImageUrl(member.image)} 
                        alt={member.name}
                        className="rounded-full object-cover w-full h-full shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/128/128';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <Separator className="my-12" />

          <section className="mb-16">
            <h2 className="text-3xl font-semibold mb-8 flex items-center">
              <Users className="mr-2" /> Library Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {libraryTeam.map((member, index) => (
                <Card key={index} className="p-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <img 
                        src={getImageUrl(member.image)} 
                        alt={member.name}
                        className="rounded-full object-cover w-full h-full shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/api/placeholder/128/128';
                        }}
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                    <p className="text-gray-600 font-medium mb-1">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default About;